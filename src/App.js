import React, {
  useState,
  useReducer,
  useRef,
  useEffect
} from "react";
import './App.css';
import Timer from "./Timer";
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
