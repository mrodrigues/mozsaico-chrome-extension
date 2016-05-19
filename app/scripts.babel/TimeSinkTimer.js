'use strict';

window.TimeSinkTimer = (function IIFE(Date, setInterval) {
  return TimeSinkTimer;

  function TimeSinkTimer() {
    const RESTART_TIMER_LIMIT = minutes(10);
    const TIME_DEPLETED_LIMIT = minutes(5);
    const WAIT_AFTER_TIME_DEPLETED = minutes(60);
    let startedWastingTime;
    let lastTimeDepleted = new Date(new Date() - WAIT_AFTER_TIME_DEPLETED);
    let millisecondsWasted = 0;

    let timerId;

    let timeDepletedCallback = function noop() {};

    return { checkTimeSink, onTimeDepleted };

    function onTimeDepleted(callback) {
      timeDepletedCallback = callback;
    }

    function checkTimeSink(currentUrl) {
      if (isTimeSink(currentUrl)) {
        startedWastingTime = new Date();

        startTimer();
      } else {
        stopTimer();

        if (timeSince(startedWastingTime) >= RESTART_TIMER_LIMIT) {
          millisecondsWasted = 0;
        }
      }
    }

    function startTimer() {
      if (!timerId) {
        timerId = setInterval(increaseCounterAndCheckLimit, seconds(1));
      }
    }

    function increaseCounterAndCheckLimit(){
      millisecondsWasted += seconds(1);

      if (millisecondsWasted >= TIME_DEPLETED_LIMIT &&
          timeSince(lastTimeDepleted) >= WAIT_AFTER_TIME_DEPLETED) {
        millisecondsWasted = 0;
        timeDepletedCallback();
        lastTimeDepleted = new Date();
      }
    }

    function stopTimer() {
      clearInterval(timerId);
      timerId = undefined;
    }
  }

  function seconds(n) {
    return n * 1000;
  }

  function minutes(n) {
    return 60 * seconds(1);
  }

  function timeSince(date) {
    return new Date() - date;
  }

  function isTimeSink(currentUrl) {
    return /https?:\/\/www.facebook.com/.test(currentUrl);
  }
})(Date, setInterval);
