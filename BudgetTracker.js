const form=document.querySelector('.add');
const incomeList=document.querySelector('ul.income-list');
const expenseList=document.querySelector('ul.expense-list');

const balance=document.getElementById('balance');
const income=document.getElementById('income');
const expense=document.getElementById('expense');

//important part to store data into localstorage.
let transactions=localStorage.getItem("transactions")!==null?JSON.parse(localStorage.getItem("transactions")):[];



function generateTemplate(id, source, amount, time){
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                <span>₹${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`;
}


function addTranstionDOM(id,source,amount,time){
    if(amount>0){
        incomeList.innerHTML+=generateTemplate(id, source, amount, time);
    }
    else{
        expenseList.innerHTML+=generateTemplate(id, source, amount, time);
    }

}


function addTranstionDetail(source,amount){
    const time= new Date();
    const transaction={
        id:Math.floor(Math.random()*100000),
        source:source,
        amount:amount,
        time:`${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem("transactions",JSON.stringify(transactions));
    addTranstionDOM(transaction.id,source,amount,transaction.time);

}



function getTransaction(){
    if(transactions===!null){
        transactions.classList.add("hide")
    }
    transactions.forEach(transaction => {
        if(transaction.amount>0){
            incomeList.innerHTML+=generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }
        else{
            expenseList.innerHTML+=generateTemplate(transaction.id, transaction.source, transaction.amount, transaction.time);
        }       
    });
}
getTransaction();

form.addEventListener('submit',event=>{
    event.preventDefault();
    if(form.source.value.trim()===""|| form.amount.value===""){
        return alert("Please enter the value!!");
    }
    addTranstionDetail(form.source.value.trim(),Number(form.amount.value));
    updateStats();
    form.reset();
});

function deleteTransaction(id){
    transactions=transactions.filter(transaction=>{
        return transaction.id !==id;
    });
    localStorage.setItem("transactions", JSON.stringify(transactions));
}


incomeList.addEventListener('click',event=>{
    if(event.target.classList.contains('delete')){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStats();

    }
});
expenseList.addEventListener('click',event=>{
    if(event.target.classList.contains('delete')){
        event.target.parentElement.remove();
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        updateStats();

    }
});

function updateStats(){
    const updateIncome=transactions.filter(transaction=>transaction.amount>0).reduce((total,transaction)=>total+=transaction.amount,0);
    const updateexpense=transactions.filter(transaction=>transaction.amount<0).reduce((total,transaction)=>total+=Math.abs(transaction.amount),0);
    updateBalance=updateIncome-updateexpense;
    balance.textContent=updateBalance;
    income.textContent=updateIncome;
    expense.textContent=updateexpense;
}
updateStats()