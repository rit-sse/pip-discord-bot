const crypto = require('node:crypto');

function hash(input) {
    return crypto.createHash('sha256').update(input).digest('hex')
}
function sign(input, secret) {
    const encoded = encodeURIComponent(input);
    return `${encoded}/${hash(hash(Buffer.from(secret).toString('base64')) + encoded)}`
}

function verify(input, secret) {
    const parts = input.split('/');
    const payload = decodeURIComponent(parts[0] || '');
    if (
        parts.length !== 2 ||
        parts[1].length !== 64 ||
        !payload ||
        sign(payload, secret) !== input
    ) {
        return null;
    }
    return payload;
}

module.exports = { hash, sign, verify };