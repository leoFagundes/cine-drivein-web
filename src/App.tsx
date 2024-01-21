import Router from './routes';
import {Input} from './Components/Atoms/Input/Input';
import './Global.scss';

function App() {

  return (
      <>
          <Input errorLabel="Salve familia" type='password' onChange={() => console.log('')} placeholder={'Naruto'} />
          <Router />
      </>
  );
}

export default App;
