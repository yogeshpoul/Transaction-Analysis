
import { useEffect, useState ,useRef} from 'react'
import Chart from 'chart.js/auto';


function App() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState('March');
  const [statistics, setStatistics] = useState(selectedMonth);
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const [filter, setFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState(""); // State for debounced filter

  useEffect(() => {
    // Debouncing filter updates
    const timer = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 1000); // Adjust the debounce delay here (in milliseconds)

    return () => {
      clearTimeout(timer);
    };
  }, [filter]);

  useEffect(() => {
    // Fetch transactions data from the provided API
    if (selectedMonth === "ALL Months") {
      fetch(`https://backend-5-0vue.onrender.com/transactions?page=${page}&search=${debouncedFilter}`)
        .then(response => response.json())
        .then(data => {
          // Update state with the transactions array
          setTransactions(data.transactions);
        })
    } else {
      const API = `https://backend-5-0vue.onrender.com/transactions?month=${selectedMonth}&page=${page}&search=${debouncedFilter}`;
      fetch(API)
        .then(response => response.json())
        .then(data => {
          // Update state with the transactions array
          setTransactions(data.transactions);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });
    }
  }, [page, selectedMonth, debouncedFilter]);


  useEffect(()=>{
  fetch(`https://backend-5-0vue.onrender.com/statistics?month=${selectedMonth}`)
  .then(response => response.json())
  .then(data => {
    // console.log(data)
    setStatistics(data)
  })
  },[selectedMonth])


  useEffect(() => {
    // Fetch data from the API
    // axios.get(`https://backend-5-0vue.onrender.com/bar-chart?month=${selectedMonth}`)
    //   .then(response => {
    //     // Update state with the data
    //     setData(response.data);
    //   })
    fetch(`https://backend-5-0vue.onrender.com/bar-chart?month=${selectedMonth}`)
  .then(response => response.json())
  .then(data => {
    // console.log(data)
    setData(data)
  })


  }, [selectedMonth]);

  useEffect(() => {
    // Draw chart once data is fetched
    if (data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    if (chartRef.current !== null) {
      chartRef.current.destroy(); // Destroy existing chart if it exists
    }

    const ctx = document.getElementById('barChart');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.priceRange),
          datasets: [{
            label: 'Count',
            data: data.map(item => item.count),
            backgroundColor: 'rgba(54, 162, 235, 0.5)', // Blue color with transparency
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Price Range'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count'
              }
            }
          }
        }
      });
    }
  };

  

  return (
  <>
    <div style={{border: "5px solid #ddd",
  borderRadius: "20px",
  padding: "20px",
  margin: "20px auto",
  maxWidth: "80%",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f8df8c"}}>

      <h2 style={{
                  margin: "auto",
                  width: "13%",
                  padding: "10px"}}>Transactions</h2>

      <input style={{border: "1px solid",
                  margin: "auto",
                  width: "50%",
                  padding: "8px"}} placeholder='Search Transactions' onChange={(e)=>{setFilter(e.target.value);setPage(1)}}></input>

      
      {/* <label htmlFor="monthDropdown">Select Month:</label> */}
        <select style={{left:"75%",position:"sticky",padding: "8px"}} id="monthDropdown" value={selectedMonth} onChange={(e) =>{ setSelectedMonth(e.target.value);setPage(1)}}>
        <option value="ALL Months">ALL Months</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          {/* Add more months as needed */}
        </select>
      <table style={{backgroundColor:"#f8df8c",borderRadius:"10px",borderCollapse:"collapse"}}>
        <thead>
          <tr >
            <th style={{border:"2px solid #000000",padding:"8px"}}>Title</th>
            <th style={{border:"2px solid #000000",padding:"8px"}}>Price</th>
            <th style={{border:"2px solid #000000",padding:"8px"}}>Description</th>
            <th style={{border:"2px solid #000000",padding:"8px"}}>Category</th>
            <th style={{border:"2px solid #000000",padding:"8px"}}>Image</th>
            <th style={{border:"2px solid #000000",padding:"8px"}}>Sold</th>
            <th style={{border:"2px solid #000000",padding:"8px"}}>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id} style={{border:"2px solid #000000",padding:"8px"}}>
              <td style={{border:"2px solid #000000",padding:"8px", textAlign: 'left'}}>{transaction.title}</td>
              <td style={{border:"2px solid #000000",padding:"8px", textAlign: 'left'}}>${transaction.price}</td>
              <td style={{border:"2px solid #000000",padding:"8px", textAlign: 'left'}}>{transaction.description}</td>
              <td style={{border:"2px solid #000000",padding:"8px", textAlign: 'left'}}>{transaction.category}</td>
              <td style={{border:"2px solid #000000",padding:"8px", textAlign: 'left'}}><img src={transaction.image} alt={transaction.title} style={{ width: '50px' }} /></td>
              <td style={{border:"2px solid #000000",padding:"8px", textAlign: 'left'}}>{transaction.sold ? 'Yes' : 'No'}</td>
              <td style={{border:"2px solid #000000",padding:"8px", textAlign: 'left'}}>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
        {/* <h5>page no {page}</h5> <br />
        <button onClick={()=>{
          setPage(page-1)
        }}>Previous</button>
        <button onClick={()=>{
          setPage(page+1)
        }}>Next</button>  */}
        <br />
      
          <div> 
            {/* <h5 style={{ marginRight: '10px' }}>page no {page}</h5> */}
          <span>Page No: {page}</span>
          <a style={{left:"50%",position:"absolute",padding: "8px",cursor: 'pointer'}} onClick={() => { setPage(prevPage => Math.min(prevPage + 1, 10)) }}>Next</a>
          <a style={{left:"40%",position:"absolute",padding: "8px",cursor: 'pointer'}} onClick={() => { setPage(prevPage => Math.max(prevPage - 1, 1)) }}>Previous</a>
          <span style={{left:"80%",position:"absolute",padding: "8px"}}>Per Page: 10</span>
          </div>

      </table>
    </div>


    <div style={{
  display: 'flex',
  flexDirection: 'row', // For mobile devices, switch to column layout
  alignItems: 'center', // Center items horizontally
  justifyContent: 'center',
  gap: '5px', // Adjust the gap between the divs
}}>
  <div style={{
    border: '5px solid #ddd',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    width: '400px',// Max width for larger screens,
    height:"400px",
  }}>
    <h2 style={{marginBottom: '20px'}}>Statistics: {selectedMonth}</h2>
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '20px',
      background: '#f8df8c',
      padding: '20px',
    }}>
      <p>Total Sale: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  </div>

  <div style={{
    border: '5px solid #ddd',
    borderRadius: '20px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    width: '100%', // Full width on mobile devices
    maxWidth: '600px', // Max width for larger screens
  }}>
    <h2 style={{marginBottom: '20px'}}>Bar Chart: {selectedMonth}</h2>
    <div style={{ width: '100%', height: '300px' }}>
      <canvas id="barChart"></canvas>
    </div>
  </div>
</div>




    
  </>
  );
}

export default App
