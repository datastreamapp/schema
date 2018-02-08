
const self = {};
module.exports = self;

/**
 * makeId
 * Converts name into an id
 *
 * @param str
 * @returns {string}
 */
self.makeId = (str) => {
    return str.replace(/[ -]/g, '').trim();
};

self.makeIdTwo = (str) => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim().replace(/[ ]+/g, '_');
};

const timezones = {
    ADT:'America/Halifax',
    AHST:'America/Anchorage',    // AKST
    AKDT:'America/Anchorage',
    AKST:'America/Anchorage',
    AST:'America/Halifax',
    BST:'America/Anchorage',     // AKST
    CDT:'America/Chicago',
    CST:'America/Chicago',
    EDT:'America/New_York',
    EST:'America/New_York',
    GST:'Pacific/Guam',
    HADT:'Pacific/Honolulu',
    HAST:'Pacific/Honolulu',
    MDT:'America/Denver',
    MST:'America/Phoenix',      // * No DST
    NDT:'America/St_Johns',
    NST:'America/St_Johns',
    PDT:'America/Los_Angeles',
    PST:'America/Los_Angeles',
    SST:'Pacific/Samoa',
    YST:'America/Anchorage'  // AKST
};

self.makeTimezone = (abbr) => {
    const tz = timezones[abbr];
    if (!tz) return 'UTC';
    return tz;
};
