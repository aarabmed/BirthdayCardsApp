import { Modal, Button } from 'antd';
import Router from 'next/router';




function countDown() {
  let secondsToGo = 5;
  const modal = Modal.success({
    content: `You are not authenticated, you'll be redirected to the login page in ${secondsToGo} second.`,
    okButtonProps: { disabled: true,style: { display: 'none' }}
 });
  const timer = setInterval(() => {
    secondsToGo -= 1;
    modal.update({
      content: `You are not authenticated, you'll be redirected to the login page in ${secondsToGo} second.`,
    });
  }, 1000);
  setTimeout(() => {
    clearInterval(timer);
    Router.push('login')
    modal.destroy();
  }, secondsToGo * 1000);

}

export default countDown