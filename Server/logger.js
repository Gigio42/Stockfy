import stream from 'stream';
import pino from 'pino';
import chalk from 'chalk';

const logThrough = new stream.Transform({
  transform(chunk, encoding, callback) {
    let logData = JSON.parse(chunk.toString());
    let logTime = new Date(logData.time);
    let formattedTime = `${logTime.getHours().toString().padStart(2, '0')}:${logTime.getMinutes().toString().padStart(2, '0')}:${logTime.getSeconds().toString().padStart(2, '0')}`;
    let maskedMessage = logData.msg.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '***.***.***.***').replace(/\[::1\]/g, 'localhost');
    let formattedMessage = `[${chalk.green(formattedTime)}] ${maskedMessage}\n`;

    if (logData.req && logData.req.remoteAddress) {
      let maskedAddress = logData.req.remoteAddress.replace(/\d{1,3}(?=\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, '***');
      formattedMessage += `Request: ${chalk.blue(`${logData.req.method} ${logData.req.url} from ${maskedAddress}:${logData.req.remotePort}`)}\n`;
    }

    if (logData.res) {
      formattedMessage += `Response: ${chalk.red(logData.res.statusCode)}\n`;
    }

    this.push(formattedMessage + '\n');
    callback();
  }
});

const log = pino({ level: 'info' }, logThrough);
logThrough.pipe(process.stdout);

export default log;