import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';

const bgColorMap = {
  red: 'bg-red-200',
  blue: 'bg-blue-200',
  green: 'bg-green-200',
  yellow: 'bg-yellow-200',
  purple: 'bg-purple-200',
};

const SummaryCard = ({ title, value, Icon, color = 'blue', trend = 'up', message = '',periodOption = 'T', setPeriodOption }) => {

  const bgClass = bgColorMap[color] || 'bg-gray-200';
  const isUp = trend === 'up';

  const period = ['T', 'W', 'M'];

  const changeSalesPeriod = () => {
    const index = period.indexOf(periodOption);
    setPeriodOption(period[(index+1)% period.length]);
  }

  return (
    <div className='max-w-[350px] min-w-[250px] min-h-[130px] bg-white dark:bg-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-900 rounded-xl p-4 flex flex-col gap-3 hover:cursor-pointer max-md:w-full animate'>
      <div className='flex items-center justify-between gap-2'>
        <h2 className="text-lg font-medium">{title}</h2>
        <div className='flex items-center gap-2'>
          <div className={`rounded-full p-2 max-w-8 max-h-8 min-w-8 min-h-8 flex items-center justify-center ${bgClass}`}>
            {
              title == 'Total Inventory' && <Icon className='text-2xl text-white' color={color} size={15} />
            }
            {
              title == 'Total Sales' && <div onClick={changeSalesPeriod} className='text-sm text-red-900'>{periodOption}</div>
            }
            {
              title == 'Total Revenue' && <div onClick={changeSalesPeriod} className='text-sm text-green-900'>{periodOption}</div>
            }
          </div>
        </div>
      </div>
      <div>
        <span className='text-4xl font-bold text-gray-800 dark:text-white'><CountUp start={0} end={value} duration={1} separator="," /></span>
      </div>
      <div className={`flex items-center gap-2 text-sm text-green-600 pl-1`}>
           {
              title != 'Total Inventory' ? `${value} ₹ ${title.split(' ')[1]} in this month`:`${value} items in stock`
           }
          
      </div>
    </div>
  );
};

export default SummaryCard;
