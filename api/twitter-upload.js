const needle = require("needle");
const fs = require("fs");
const path = require("path");

const [, scriptName, filename, uploadURL] = process.argv;
if (!filename || !uploadURL) {
    console.error(`Usage: node ${path.basename(scriptName)} filename upload_url`);
    process.exit(-1);
}

async function uploadFile(file, url) {
    // rangeEnd is the index of the last byte in the file, i.e. number of bytes in file
    const rangeEnd = (await fs.promises.stat(file)).size;

    let options = {
        headers: {
            "Content-Range": `bytes */${rangeEnd}`,
        },
    };

    const response = await needle("put", url, null, options);

    switch (response.statusCode) {
        case 200:
        case 201:
            console.log("Upload complete");
            return;
        case 308:
            return resumeUpload(response, file, url);
        default:
            console.log("Got unexpected response code: ", response.statusCode);
            return;
    }
}

async function resumeUpload(response, file, url) {
    console.log("Upload not completed, resuming");
    if (response.headers.range) {
        let resumeOffset = Number(response.headers.range.split("-")[1]) + 1;

        let options = {
            headers: {
                "Content-Range": `bytes ${resumeOffset}-${rangeEnd - 1}/${rangeEnd}`,
                "Content-Length": `${rangeEnd - resumeOffset}`,
            },
        };

        let readStream = fs.createReadStream(file, { start: resumeOffset });
        return needle("put", url, readStream, options);
    } else {
        console.log("Initiating upload");
        let options = {
            headers: {
                "Content-Type": "text/plain",
            },
        };

        let readStream = fs.createReadStream(file);
        return needle("put", url, readStream, options);
    }
}

// Request resumable session URL
async function requestResumableSession(url) {
    const options = {
        headers: {
            "Content-Type": "text/plain",
            "Content-Length": "0",
            "x-goog-resumable": "start",
        },
    };
    console.log('a')
    const res = await needle("post", url, null, options);
    if (res.statusCode === 201) {
        const resumableSessionURL = res.headers["location"];
        console.log("Starting upload to: ", resumableSessionURL);

        await uploadFile(filename, resumableSessionURL);
    } else {
        console.log("Failed to create resumable session URI");
    }
}

requestResumableSession(uploadURL).then((result) => console.log("Upload complete"));
