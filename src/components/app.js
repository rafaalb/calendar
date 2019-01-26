import React from "react";
import Calendar from "./Calendar";
import styled from 'styled-components';

export const Icon =  styled.span`
  font-family: 'Material Icons', serif;
  font-style: normal;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: 'liga';
  ${props => props.chevron &&
    {
      color: 'green',
      padding: 10,
      fontSize: 30,
      cursor: 'pointer'
    }
  }
`;

const Logo = styled.div`
  font-size: 175%;
  text-align: center;
  color: var(--main-color);
  line-height: 1;
`;

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header>
          <Logo>
            {false && <Icon>date_range</Icon>}
            <span>
              <b>calendar</b>
            </span>
          </Logo>
        </header>
        <main>
          <Calendar />
        </main>
      </div>
    );
  }
}

export default App;