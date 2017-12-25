var arp = require('arp-a')
    , tbl = { ipaddrs: {}, ifnames : {} }
;

module.exports = function networkSimulator() {
    console.log('Network Simulator Started...');

    // aquire information about neighbors
    arp.table(function(err, entry) {
        if (!!err) return console.log('arp: ' + err.message);
        if (!entry) return;

        console.log(entry);
        tbl.ipaddrs[entry.ip] = entry.mac;
        if (!tbl.ifnames[entry.iface]) tbl.ifnames[entry.iface] = {};
        tbl.ifnames[entry.iface][entry.mac] = entry.ip;
        console.log(tbl);
    });

    console.log('Network Simulator Ended...');
};