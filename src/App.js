import React from 'react';
import Tables from './components/Tables/Tables';
import { tableColumns, tableData } from './Data/Data';


function App() {
  return (
    <div className="App">
      <Tables columns={tableColumns} data={tableData} />
    </div>
  );
}

export default App;
