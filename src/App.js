import React, {
  useState,
  useReducer,
  useRef,
  useEffect
} from "react";
import './App.css';
import Timer from "./Timer";
import { timePeriod } from "./EnumTime"
import Settings from "./Settings";
import SettingsContext from "./SettingsContext";

import {
  createSmartappDebugger,
  createAssistant,
} from "@salutejs/client";


const initAssistant = (getState/*: any*/) => {
  if (process.env.NODE_ENV === "development") {
    return createSmartappDebugger({
      token: process.env.REACT_APP_TOKEN ?? "",
      initPhrase: `Открой ${process.env.REACT_APP_SMARTAPP}`,
      getState,
    });
  }
  return createAssistant({ getState });
};

function whatTime(responseActionStr) {
  let requestedTime = undefined;

  for(let i = 0; i < timePeriod.length; i++){
    if(responseActionStr.indexOf(timePeriod[i].MinStr) !== -1 || responseActionStr.indexOf(timePeriod[i].MinNum) !== -1) {
      requestedTime = parseInt(timePeriod[i].MinNum);
    }
  }

  if(requestedTime !== undefined) {return requestedTime;}
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);
  const [appState, dispatch] = useReducer();

  const assistant = useRef();
  
  var state = {
    minutes: [],
    };

    const getStateForAssistant = () => {
      console.log("getStateForAssistant: this.state:", state);
      const state_ = {
      item_selector: {
      items: state.minutes.map(({ id, title }, index) => ({
      number: index + 1,
      id,
      title,
      })),
      },
      };
      console.log("getStateForAssistant: state:", state);
      return state_;
    };

    useEffect(() => {
      assistant.current = initAssistant(() => getStateForAssistant());
      assistant.current.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
      });
      assistant.current.on("data", (event /*: any*/) => {
        if (event.type == "smart_app_data") {
          console.log(event);
          if (event.sub != undefined) {
            console.log("Sub", event.sub);
            
          } else if (event.user_id != undefined) {
            console.log("UserId", event.user_id);
          }
        }
        console.log(`assistant.on(data)`, event);
        const { action } = event;

        dispatchAssistantAction(action);
        
  });
    },
    [appState]);

    window.addEventListener('keydown', (event) => {
      switch(event.code) {
        case 'ArrowDown':
          // вниз
          break;
         case 'ArrowUp':
          // вверх
          break;
         case 'ArrowLeft':
          // влево
          break;
         case 'ArrowRight':
          // вправо
          break;
         case 'Enter':
          // ок
         break;
      }
    });


    const dispatchAssistantAction = async (action) => {
      console.log("dispatchAssistantAction", action);
      if (action) {
        let workTime = 45;
        let breakTime = 15;
        console.log(action.minutes);
        switch (action.type) {
          case "timerUp":
            console.log("timerUp")
            document.getElementById("playBtn").click();
            break;
          case "timerDown":
            console.log("timerDown")
            document.getElementById("pauseBtn").click();
            break;
          case "openSettings":
            console.log("openSettings")
            setShowSettings(true);
            break;
          case "closeSettings":
            console.log("closeSettings")
            setShowSettings(false);
            break;
          case "setSessionTime":
            workTime = whatTime(action.minutes);
            console.log("setSessionTime")
            setWorkMinutes(workTime);
            console.log(action.minutes);
            break;
          case "setBreakTime":
            breakTime = whatTime(action.minutes);
            console.log("setBreakTime")
            setBreakMinutes(breakTime);
            break;
          default:
            break;
          }
        }
      };

  return (
    <main>
      <SettingsContext.Provider value={{
        showSettings,
        setShowSettings,
        workMinutes,
        breakMinutes,
        setWorkMinutes,
        setBreakMinutes,
      }}>
        {showSettings ? <Settings /> : <Timer />}
      </SettingsContext.Provider>
    </main>
  );
}


export default App;
