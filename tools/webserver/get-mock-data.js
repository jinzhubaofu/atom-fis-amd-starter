/**
 * @file get mock data
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable no-console, fecs-no-require */

// throw new Error(JSON.stringify(process.argv));

const path = require('path');
const fs = require('fs');

let componentPath = path.normalize(process.argv[2]);
let request = process.argv[3];
let mockFilePath = path.join(
    path.dirname(componentPath),
    `${path.basename(componentPath, '.atom.php')}.mock.js`
);

if (!fs.existsSync(mockFilePath)) {
    console.log(JSON.stringify({}));
    return;
}

let mock;

try {
    mock = require(mockFilePath);
}
catch (e) {
    console.error(e);
    return;
}

if (typeof mock !== 'function') {
    console.log(JSON.stringify(mock || {}));
    return;
}

mock = mock(request);

if (typeof mock.then !== 'function') {
    console.log(JSON.stringify(mock || {}));
    return;
}

mock.then(data => {
    console.log(JSON.stringify(data || {}));
}, error => {
    console.log(JSON.stringify({}));
});
