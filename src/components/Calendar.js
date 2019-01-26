import React, {Component } from "react"
import dateFns from "date-fns"
import moment from 'moment'
// import dateFns from 'date-fns'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
const dateFormat = 'MMMM YYYY';
import { Icon } from './App';

const Cell = styled.div`
  position: relative;
  height: 5em;
  border-right: 1px solid gray;
  overflow: hidden;
  cursor: pointer;
  background: white;
  transition: 0.25s ease-out;
  flex-grow: 0;
  flex-basis: calc(100%/7);
  width: calc(100%/7);
  ${props => props.monthInRange ? 
    {
      color: 'gray',
      pointerEvents: 'none'
    } 
    : {}
  };
  ${props => props.dayInRange ? 
    {
      border: '2px solid transparent',
      borderImage: 'linear-gradient(45deg, #1a8fff 0%,#00a86f 40%)',
      borderImageSlice: 1,
    }
    : {}
  }
`;

const Day = styled.span`
  position: absolute;
  font-size: 82.5%;
  line-height: 1;
  top: .75em;
  right: .75em;
  font-weight: 700;
`;

const Row = styled.div `
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  border-bottom: 1px solid #ccc;
`;

const Options = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  font-family: Helvetica;
  color: black;
  font-weight: 400;
`;

const EventText = styled.span`
  font-family: Helvetica;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const EventDetail = styled.span`
  color: white;
  background-color: #00a86f;
  border-radius: 5px;
  padding: 6px;
  padding-top: 2px;
  padding-bottom: 3px;
  margin-left: 2px;
  font-size: 10px;
`;

const EventContainer = styled.div`
  position: absolute;
  left: 0px;
  bottom: 2px;
`;

class Calendar extends Component {
  state = {
    currentMonth: new Date(),
    selectedDate: null,
    events: []
  };

  renderHeader() {
    return (
      <div className="header row flex-middle">
        <div className="col col-start" onClick={this.previousMonth}>
          <Icon chevron>chevron_left</Icon>
        </div>
        <div className="col col-center">
          <span>
            {dateFns.format(this.state.currentMonth, dateFormat)}
          </span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}>
          <Icon chevron>chevron_right</Icon>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return (
      <div className="days row">
        {days}
      </div>
    );
  }
  renderEvents = (day) => {
    const events = this.state.events.filter(ev => 
      moment(ev.date).isSame(this.state.currentMonth, 'month') &&
      moment(ev.date).isSame(day, 'day')
    )
    const jsx = events.map(ev => <EventDetail>{ev.text}</EventDetail>);
    return (
      <EventContainer>
        {jsx}
      </EventContainer>
    )
  }
  renderCells() {
    const {selectedDate } = this.state;
    const monthStart = moment().startOf('month').format('YYYY-MM-DD hh:mm');
    const monthEnd = moment().endOf('month').format('YYYY-MM-DD hh:mm');

    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).endOf('week');

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = moment(day).format(dateFormat);
        const auxDay = day;
        days.push(
          <Cell
            key={day}
            onClick={() => this.onDateClick(moment(auxDay))}
            monthInRange={!moment(monthStart).isSame(day, 'month')}
            dayInRange={moment(selectedDate).isSame(day, 'day')}
          >
            <Day>{formattedDate}</Day>
            {this.renderEvents(day)}
          </Cell>
        );
        day = moment(day).add(1, 'd');
      }
      rows.push(
        <Row key={day}>
          {days}
        </Row>
      );
      days = [];
    }
    return <div>{rows}</div>;
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };

  previousMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };
  _addEvent = () => {
    this.setState({
      events: this.state.events.concat({
        date: this.state.selectedDate,
        text: this.state.text
      }),
      text: '',
    })
  }
  renderSummaryEvents = () => {
    const events = this.state.events.filter(ev =>
      moment(ev.date).isSame(this.state.selectedDate, 'month') &&
      moment(ev.date).isSame(this.state.selectedDate, 'day')
    )

    const jsx = events.map((ev) => {
      return (
        <div>
          {ev.text}
        </div>
      )
    })
    if (events.length > 0) {
      return (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 20 }}>Summary of events this day</h3>
          {jsx}
        </div>
      )
    }
  }
  renderOptions = () => {
    if (this.state.selectedDate) {
      return (
        <Options>
          <EventText>Add an event for this day: </EventText>
          <input
            type={'text'}
            value={this.state.text}
            placeholder="Start typing to add an event"
            onChange={(ev) => this.setState({ text: ev.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ width: 30, marginTop: 10 }}
            onClick={this._addEvent}
          >
            Add
          </Button>
          {this.renderSummaryEvents()}
        </Options>
      )
    }
  }
  render() {
    return (
      <div className="calendar">
      {this.renderHeader()}
      {this.renderDays()}
      {this.renderCells()}
      {this.renderOptions()}
    </div>
    )
  }
}

export default Calendar;