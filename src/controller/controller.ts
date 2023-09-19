import { exec, spawn } from 'child_process';

/**
 *
 * @param req
 * @param res
 */
export function updateApiRepo(req: any, res: any) {
  const { payload } = req.body;
  console.log('🚀 ~ req.body:', req.body);
  const targetBranch = 'main';
  const repositoryPath = '~/web/api';
  const screenSessionName = 'api';
  const moveToScreenSessionCommand = `screen -r ${screenSessionName}`;
  const gitPullCommand = `cd ${repositoryPath} && git pull`;
  const getProcessIdCommand = `screen -list | grep ${screenSessionName} | awk '{print $1}'`;

  if (payload === `refs/heads/${targetBranch}`) {
    // Moverse a el screen de la api
    exec(moveToScreenSessionCommand, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error al mover en screen \n ${error}`);
        res.status(500);
      }
    });

    // Matar el proceso actual
    exec(getProcessIdCommand, (error, stdout, stderr) => {
      if (error) {
        console.log('🚀 ~ error al obtener el id del proceso', error);
        res.status(500);
      } else {
        const processId = stdout.trim();
        if (processId) {
          console.log('🚀 ~ processId:', processId);
          // Envía una señal SIGINT al proceso
          exec(`kill -INT ${processId}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error al enviar la señal SIGINT: ${error}`);
            } else {
              console.log('Señal SIGINT enviada con éxito');
            }
          });
        } else {
          console.error(
            `No se encontró un proceso para la sesión de screen: ${screenSessionName}`
          );
        }
      }
    });
    // Ejecuta un pull
    exec(gitPullCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar git pull: ${error}`);
        return res.status(500).json({ error: 'Error al ejecutar git pull' });
      }
      console.log('pull ejecutado con éxito');

      // Ejecuta npm run build y npm run start en secuencia
      exec(
        `cd ${repositoryPath} && npm run build && npm run start`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error al ejecutar npm run build/start: ${error}`);
            return res
              .status(500)
              .json({ error: 'Error al ejecutar npm run build/start' });
          }
          console.log('npm run build y npm run start ejecutados con éxito');
          res
            .status(200)
            .json({ message: 'Todas las operaciones completadas con éxito' });
        }
      );
    });
  } else {
    res.status(200).json({ message: 'No se requiere acción' });
  }
}
