var trimSurplus = (str) => {
    return str.replace(/\r\n/g, '').replace(/\s{2,}/g, ' ').replace('\r', '').replace('\n', '').trim();
}

module.exports = trimSurplus;
