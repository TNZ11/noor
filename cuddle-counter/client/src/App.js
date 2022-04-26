import { React, useState, useEffect } from 'react';
import { intervalToDuration } from 'date-fns';
import { supabase } from './SupabaseClient'
import './App.css';

//TODO:
// - congratulations div
// - styling
// - > 10 logic
// timer

const useTimer = () => {
  const [now, setNow] = useState(new Date());
  const fromDate = new Date('01 04 2022');
  let months = 0;
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  const duration = intervalToDuration({
    start: fromDate,
    end: now
  })

  months = duration.months;
  days = duration.days;
  hours = duration.hours;
  minutes = duration.minutes;
  seconds = duration.seconds;

  return {
    months,
    days,
    hours,
    minutes,
    seconds
  };
}

const Timer = () => {
  const { months, days, hours, minutes, seconds } = useTimer();

  return (
    <div className="container">
      <h1 className="timer-heading">Time since 04/01/22</h1>
      <div id="countdown">
        <ul>
          <li><span ></span>Months <span className='number'>{months}</span></li>
          <li><span ></span>Days <span className='number'>{days}</span></li>
          <li><span ></span>Hours <span className='number'>{hours}</span></li>
          <li><span ></span>Minutes <span className='number'>{minutes}</span></li>
          <li><span ></span>Seconds <span className='number'>{seconds}</span></li>
        </ul>
      </div>
    </div>
  );
}

const Button = () => {
  const [cuddles, setCuddles] = useState();
  const [totalcuddles, setTotalCuddles] = useState();
  const [kisses, setBigKiss] = useState();
  const [buttonLabel, setButtonLabel] = useState('Add Cuddles');

  const html = [];

  const handleOnClick = () => {

    if (buttonLabel === 'Add Cuddles') {
      setCuddles(cuddles + 1);
      setTotalCuddles(totalcuddles + 1);
      if (cuddles >= 9) {
        setButtonLabel('Checkout');
      }
    } else {
      setCuddles(0);
      setBigKiss(kisses + 1);
      setButtonLabel('Add Cuddles');
    }
  };

  useEffect(() => {
    updateData();
  }, cuddles, kisses);

  const updateData = async () => {
    try {
      const updates = {
        id: 1,
        cuddles,
        kisses,
        totalcuddles,
      }

      let { error } = await supabase.from('cuddlecounter').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } 
  }

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      let { data, error, status } = await supabase
        .from('cuddlecounter')
        .select(`cuddles, kisses, totalcuddles`)
        .eq('id', 1)
        .single()


      if (error && status !== 406) {
        throw error
      }

      if (data) {
        console.log(data);
        setCuddles(data.cuddles)
        setBigKiss(data.kisses)
        setTotalCuddles(data.totalcuddles)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  html.push(<p className='sub-headings'>❤️ Number of Big Kisses: {kisses}</p>);

  return (
    <div>
      <p className='sub-headings'>❤️ Number of Cuddles: {cuddles}</p>
      {html}
      <button className="cybr-btn" onClick={handleOnClick}> {buttonLabel} <span aria-hidden>{''}</span>
        <span aria-hidden className="cybr-btn__glitch">Noorie</span>
        <span aria-hidden className="cybr-btn__tag"></span></button>
    </div>
  );
}

const NoorieCuddles = ({ cuddles, setCuddles }) => {

  return (
    <div>
      <Button cuddles={cuddles} setCuddles={setCuddles} />
    </div>
  );

};

function App () {

  return (
    <div className="App">
      <h1 className='heading'>{'I Owe Noorie 🤭'}</h1>
      <NoorieCuddles />
      <Timer />
      <span style={{ fontSize: '30px', position: 'absolute', bottom: '45px', marginLeft: 'auto', marginRight: 'auto', left: '45px', right: '0px', textAlign: 'center', color: 'white' }}>A Noorie Site ❤️  &copy;</span>
    </div>
  );
}

export default App;
