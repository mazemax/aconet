var neighbours = [];
var net = require('net');
var address,
    ifaces = require('os').networkInterfaces();
var nmap = require('libnmap');

module.exports = function networkSimulator(server) {
    setTimeout(function(){
        console.log('Network Simulator Started...');

        // Iterate over interfaces ...
        for (var dev in ifaces) {
            ifaces[dev].filter(function(details) {
                (details.family === 'IPv4' && details.internal === false) ? address = details.address: undefined;
            });
        }
        console.log("Current IP/port");
        console.log(address);

        // aquire information about neighbors
        var opts = {
            ports: '8080-8180',
            range: [
                '172.18.0.0-120'
            ]
        };
        nmap.scan(opts, function(err, report) {
            if (err) throw new Error(err);

            var hostArray = [];
            for (var item in report) {
                var hostObj = report[item].host;
                hostArray = hostObj.map(function(host) {
                    return host.address[0]['item']['addr'];
                });
            }

            neighbours = hostArray.filter(e => e !== address);
            console.log(neighbours);
        });

        // Send data
        // var client = new net.Socket();
        // client.connect(8080, '127.0.0.1', function() {
        //     console.log('Connected');
        //     client.write('Hello, server! Love, Client.');
        // });
        //
        // client.on('data', function(data) {
        //     console.log('Received: ' + data);
        //     client.destroy(); // kill client after server's response
        // });
        //
        // client.on('close', function() {
        //     console.log('Connection closed');
        // });

        console.log('Network Simulator Ended...');
    }, 5000, server);
};