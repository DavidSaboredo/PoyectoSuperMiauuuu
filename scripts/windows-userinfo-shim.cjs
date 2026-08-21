// Node 24 puede devolver ENOMEM en uv_os_get_passwd en algunas instalaciones
// de Windows. Capacitor sólo consulta este dato para conocer la terminal.
const os = require('node:os');
const originalUserInfo = os.userInfo;

os.userInfo = (...args) => {
    try {
        return originalUserInfo(...args);
    } catch (error) {
        if (error?.code !== 'ERR_SYSTEM_ERROR') throw error;
        return {
            uid: -1,
            gid: -1,
            username: process.env.USERNAME || 'windows',
            homedir: process.env.USERPROFILE || process.cwd(),
            shell: process.env.COMSPEC || 'cmd.exe'
        };
    }
};
