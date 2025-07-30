import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddAgentForm from "./Components/AddAgentForm";
import ViewAgents from "./Components/ViewAgents";
import EditAgent from "./Components/EditAgent";
import UploadCSV from "./Components/UploadCSV";

function App() {
  return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/add-agent" element={<AddAgentForm/>}/>
        <Route path="/view-agents" element={<ViewAgents/>}/>
        <Route path="/edit-agent/:id" element={<EditAgent/>}/>
        <Route path="/upload" element={<UploadCSV/>}/>
      </Routes>
  );
}

export default App;
