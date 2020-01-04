'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    // had enabled by egg
    // static: {
    //   enable: true,
    // }
    // egg-validate 作为 validate 插件的示例
    validate: {
        enable: true,
        package: 'egg-validate',
    },
};
