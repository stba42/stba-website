var through = require('through2'),
    gutil = require('gulp-util');

module.exports = function(opts) {
    opts                 = opts || {};
    opts.tag             = opts.tag || 'head';
    opts.uid             = opts.uid || '';
    opts.nonceTag        = opts.nonceTag        === true  ? true  : false;
    opts.minify          = opts.minify          === true  ? true  : false;
    // opts.indent can be 0, so check for undefined instead of presence
    opts.indent          = undefined != opts.indent ? opts.indent : 4;

    return through.obj(function(file, enc, cb) {
        var gtagString = '',
            indentString = new Array(opts.indent + 1).join(' '),
            nonce = !!opts.nonceTag ? ' nonce="{{nonce}}"' : '',
            content;

        if (file.isNull()) {
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new Error('gulp-gtag: streams not supported'));
        }

        // Populate the content string
        gtagString += '' +
            '<' + opts.tag + '>\n' +
            indentString + '<!-- Global site tag (gtag.js) - Google Analytics -->\n' +
            indentString + '<script async src="https://www.googletagmanager.com/gtag/js?id=' + opts.uid + '"></script>\n' +
            indentString + '<script' + nonce + '>\n' +
            indentString + indentString + 'window.dataLayer = window.dataLayer || [];\n' +
            indentString + indentString + 'function gtag(){dataLayer.push(arguments);}\n' +
            indentString + indentString + 'gtag(\'js\', new Date());\n' +
            '\n' +
            indentString + indentString + 'gtag(\'config\', \'' + opts.uid + '\', { \'anonymize_ip\': true });\n' +
            indentString + '</script>\n';

        // Minify the code, if desired
        if(opts.minify) {
            gtagString = gtagString.replace(/\s*\n\s*/g, '');
        }

        // Get the file content
        content = file.contents.toString();

        // Replace the content with the augmented markup
        content = content.replace('<' + opts.tag + '>', gtagString);

        // Reassign the buffer
        file.contents = new Buffer(content);

        // Notify Gulp that we are done
        cb(null, file);
    });

};
