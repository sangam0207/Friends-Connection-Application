import api from '@/services';

export const apiGetProfile = async () => {
   return await api.get('/user/getProfile');
};

export const apiUpdateProfile = async (payload: {
  name?:string;
  profilePic?:string;
 
}) => {
  console.log(payload,12)
  return await api.put('/user/update-profile', payload);
};
