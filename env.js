// 读取git 版本号
let execSync = require('child_process').execSync;
let gitBranch = "";
if (process.env.BUILD_GIT_BRANCH) {
    gitBranch = process.env.BUILD_GIT_BRANCH;
} else {
    gitBranch = execSync(`git symbolic-ref --short HEAD`).toString().trim()
}
let gitVersion = gitBranch.split('/')[1] || `${Date.now().toString(16)}`;
// 获取构建环境
let buildArgv = {
    def_publish_env: 'dev',
    def_publish_type: 'local'
}
if (process.env.BUILD_ARGV_STR) {
    buildArgv = require('yargs-parser')(process.env.BUILD_ARGV_STR);
}  
const devRootPath = `//dev.g.alicdn.com/cn-dev/pcs-static/${gitVersion}/`;
const prodRootPath = `//g.alicdn.com/cn-dev/pcs-static/${gitVersion}/`;
const buildEnv = buildArgv['def_publish_env'];
let publicPath = buildEnv == 'prod' ? prodRootPath : devRootPath;
let buildCacheRoot = buildEnv == 'prod' ? "build_production" : "build_development";
if(buildArgv['def_publish_type'] === 'local') {
    publicPath = '/'
}
console.log('===================构建环境==============', buildArgv['def_publish_env'])
console.log('===============版本号=============', gitVersion)
module.exports = {
    version: gitVersion,
    env: buildArgv['def_publish_env'],
    rootPath: publicPath,
    buildCacheRoot
}