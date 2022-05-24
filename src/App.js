import './App.css';
import Panel from './Components/Panel'
import 'bootstrap/dist/css/bootstrap.css';

function App() {
  return (
    <div className="container h-100 border border-primary d-flex flex-column align-items-center">
        <div className="w-50 d-flex flex-column my-2 mx-auto border border-primary">
          <Panel />
        </div>
    </div>
     
  );
}

export default App;
