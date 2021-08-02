
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Foodchoice from '../pages/Foodchoice'
import Foodchoice1 from '../pages/Foodchoice1'
import Foodchoice2 from '../pages/Foodchoice2'
import Foodchoice3 from '../pages/Foodchoice3'
import FoodchoiceAdd from "../pages/FoodchoiceAdd"
import FoodchoiceEdit from "../pages/FoodchoiceEdit"

function App() {
  return (
    <Router>
          <Switch>
            <Route path='/foodchoice/' component={Foodchoice}/>    
            <Route path='/foodchoice1/' component={Foodchoice1}/>    
            <Route path='/foodchoice2/' component={Foodchoice2}/>    
            <Route path='/foodchoice3/' component={Foodchoice3}/>    
            <Route path='/foodchoiceAdd/' component={FoodchoiceAdd}/>    
            <Route path='/foodchoiceEdit/:products_per_serving_id' component={FoodchoiceEdit}/>    
          </Switch>
        {/* </Layout> */}
    </Router>
  )
}

export default App

