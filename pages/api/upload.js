import { IncomingForm } from 'formidable';
import cloudinary from 'cloudinary';
import { getTokenFromServerCookie } from '../../lib/auth';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function upload(req, res) {
  if (req.method === 'POST') {
    const data = await new Promise((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    // const file = data?.files?.avatar.filepath;
    const { user_id } = data.fields;
    data.fields.prefEstado = data.fields.prefEstado ? data.fields.prefEstado.split(",") : null
    //return res.json({ message: 'success' });
    // console.log({ edos:data.fields.prefEstado })
    data.fields.telefono = data.fields.telefono === '' ? null : data.fields.telefono
    data.fields.edad = data.fields.edad === 'null' ? null : data.fields.edad
    data.fields.nombre = data.fields.nombre === 'null' ? null : data.fields.nombre
    data.fields.estadoDeOrigen = data.fields.estadoDeOrigen === 'null' ? null : data.fields.estadoDeOrigen
    const jwt = getTokenFromServerCookie(req);
    //console.log({ jwt })

    console.log({ data })
    
    const body = JSON.stringify({
      ...data.fields,
    })
    let userForm = new FormData();
    userForm.append('files', data.files.avatar);
    userForm.append('data', data);

    // console.log({ body })
    const userResponse = await new Promise(async (resolve, reject) => {
      const serverData = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/user/me`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          body:userForm,
        }
      );

      // // console.log({ formData })
      // // avatarForm.append('source', 'users-permissions');
      // // avatarForm.append('file', data.files.avatar.filepath);

      // const uploadAvatarResponse = await fetch(
      //   `${process.env.NEXT_PUBLIC_STRAPI_URL}/upload`,
      //   {
      //     method: 'post',
      //     headers: {

      //       Authorization: `Bearer ${getTokenFromLocalCookie()}`,
      //     },
      //     body: avatarForm
      //   }
      // );

      // const avatarData = await uploadAvatarResponse.json();
      // // console.log({ avatarForm })
      //  console.log({ serverData })
      // const response = await serverData.json();
      resolve({ serverData })

    }
    )

    console.log({ userResponse })
    return res.json({ message: 'success' });

    try {
      let avatarForm = new FormData();
      avatarForm.append('files', data.files.avatar.filepath);
      avatarForm.append('ref', 'api::user.user');
      avatarForm.append('refId', user_id);
      avatarForm.append('field', 'avatar');
      // avatarForm.append('source', 'users-permissions');
      // avatarForm.append('file', data.files.avatar.filepath);


      console.log({ avatarForm })
      const uploadAvatarResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/upload`,
        {
          method: 'post',
          headers: {

            Authorization: `Bearer ${jwt}`,
          },
          body: avatarForm
        }
      );
      console.log({ uploadAvatarResponse })

      // const response = await cloudinary.v2.uploader.upload(file, {
      //   public_id: user_id,
      // });
      // const { public_id } = response;



      // const userResponse = await fetch(
      //   `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${user_id}`,
      //   {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${jwt}`,
      //     },
      //     body: JSON.stringify({
      //       ...data.fields,
      //     }),
      //   }
      // );
      // console.log({ userResponse })

      // const data = await userResponse.json();
      return res.json({ message: 'success' });
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  } else {
    return res.status(403).send('Forbidden');
  }
}
