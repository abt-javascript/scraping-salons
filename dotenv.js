
function init() {
    const dotenv = require('dotenv');
    const dot_env = dotenv.config();
    
    if (dot_env.error) {
        throw result.error
    }

    console.log('dotenv ready');
}

module.exports = init();