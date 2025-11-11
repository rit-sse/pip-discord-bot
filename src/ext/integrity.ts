import crypto from 'node:crypto';

function hash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
}

function sign(input: string, secret: string): string {
    const encoded = encodeURIComponent(input);
    return `${encoded}/${hash(hash(Buffer.from(secret).toString('base64')) + encoded)}`;
}

function verify(input: string, secret: string): string | null {
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

export { hash, sign, verify };