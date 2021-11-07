// BUDGET CONTROLLER
var budgetControl = (function(){
  // Some code
    var Expense = function(id, desc, value){
        this.id = id,
        this.desc = desc,
        this.value = value,
        this.percentage = -1
    }
    Expense.prototype.calcPercentage= function(totalIncome){
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome) * 100);
        } else{
            this.percentage= -1;
        }
    }

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    var Income = function(id, desc, value){
        this.id = id,
        this.desc = desc,
        this.value = value
    }

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type]= sum;
    };

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, descript, valuatn){
            var newItem, ID;
            
            if(data.allItems[type].length>0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else{
                ID = 0;
            }

            if (type==='inc'){
                newItem = new Income(ID, descript, valuatn);
            } else if (type==='exp'){
                newItem = new Expense(ID, descript, valuatn);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },
        deleteItem: function(type, id){
            var ids, index;
            ids =data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index!==-1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function(){
            // calc total income and expense
            calculateTotal('inc');
            calculateTotal('exp');

            //calculate the budget income- expense
            data.budget = data.totals.inc - data.totals.exp;

            //calc percentage of income spent
            if (data.totals.inc>0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else{
                data.percentage=-1;
            }
            
        },

        calculatePercentage: function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentage: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function (){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function(){
            console.log(data);
        }
      

        // create new id 4
        //create newitem based on inc or exp type 1
        // push it into our data structure 2
        // return new element 3
    }
})();




//UICONTROLLER

var UIController = (function(){
    // object of properties

    var DOMstrings = {
        inputType: ('.add-type'),
        inputDesc: ('.add-desc'),
        inputValue: ('.add-value'),
        inputBtn: ('.add-btn'),
        incomeContainer: ('.income-list'),
        expenseContainer: ('.expense-list'),
        budgetLabel: ('.budget-value'),
        incomeLabel: ('.budget-income-value'),
        expenseLabel: ('.budget-expense-value'),
        percentageLabel: ('.budget-expense-percentage'),
        container: ('.container'),
        expensePercLabel: ('.item-percentage'),
        dateLabel: ('.budget-title-month')
    };

    var formatNumber = function(num, type){
        var numSplit, int, dec, sign;
        num = Math.abs(num);
        num= num.toFixed('2');

        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length>3){
            int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3);
        }

        dec= numSplit[1];
        type ==='exp'? sign = '-': sign='+';
        return sign + ' ' + int + '.' + dec;
    };

    var nodeListForEach =function(list, callback){
        for (var i=0; i <list.length; i++){
            callback(list[i], i);
        }
    };

    return {
        getInput: function(){
           return {
                type: document.querySelector(DOMstrings.inputType).value, // either inc or exp
                desc: document.querySelector(DOMstrings.inputDesc).value,
                value: Number(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function(obj, type){
            var html, newHtml, element;

            // Create html strings
            if(type==='inc'){
                element= document.querySelector(DOMstrings.incomeContainer);
                html = '<div class="item clearfix" id="inc-0"><div class="item-desc">%desc%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-btn"> <i class="fa fa-times-circle-o" aria-hidden="true"></i></button></div></div></div>'
            } else if (type==='exp'){
                element=document.querySelector(DOMstrings.expenseContainer);
                html = '<div class="item clearfix" id="exp-0"><div class="item-desc">%desc%</div><div class="right clearfix"><div class="item-value">%value%</div><div class="item-percentage">-2%</div><div class="item-delete"><button class="item-delete-btn"> <i class="fa fa-times-circle-o" aria-hidden="true"></i></button></div></div>'
            }

            // ADD value to PLACEHOLDER
            //newHtml = html.replace('%id%', obj.type);
            newHtml = html.replace('%desc%', obj.desc);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert into the DOM
            element.insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function(selector){
            var el;
            el = document.getElementById(selector);
            el.parentNode.removeChild(el); 
        },
        displayMonth: function(){
            var now, year, month, months;
            now = new Date();
            year = now.getFullYear();
            months = ['Jan', 'Feb','March','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
            month = now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent= ' '+ months[month] + ' '+ year;
        },

        changedType: function(){
            var fields;
            fields = document.querySelector(
                DOMstrings.inputDesc
            );

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        // clearFields: function(){
        //     var fields, fieldsArr;
        //     fields = document.querySelectorAll(DOMstrings.inputTag);
        //     fieldsArr = Array.prototype.slice.call(fields);
        //     fieldsArr.forEach(function (current, index, array) {
        //         current.value="";
        //     });
        //     fieldsArr[0].focus();
        // },

        displayBudget: function(obj){
            obj.budget > 0? type='inc':type='exp';

            document.querySelector(DOMstrings.budgetLabel).textContent= formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent= formatNumber(obj.totalInc, 'inc') ;
            document.querySelector(DOMstrings.expenseLabel) .textContent= formatNumber(obj.totalExp, 'exp');
            if(obj.percentage >0){
                document.querySelector(DOMstrings.percentageLabel).textContent= obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent= '---';
            }
            
        },

        displayPercentage: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensePercLabel);

            nodeListForEach(fields, function(current, index){
                if (percentages[index]>0){
                    current.textContent= percentages[index] + '%';
                } else {
                    current.textContent= '---';
                }
            });
        },

        getDOMstrings: function(){
            return DOMstrings;
        }
    }
})();



//APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e){
            if(e.keycode===13||e.which===13){
                ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function (){
        //1, calculate the budget
        budgetCtrl.calculateBudget();
        //2. return budget
        var budget = budgetCtrl.getBudget();
        //3. display budget inna the UI
        UICtrl.displayBudget(budget);
    }

    var updatePercentage =  function(){
        // calculate percentages
        budgetCtrl.calculatePercentage();
        // read percentages from budgetctrla
        var percentages = budgetCtrl.getPercentage();
        // update ui
        UICtrl.displayPercentage(percentages);
    }

    var ctrlAddItem = function(){
        // get the filled input data
        var input = UICtrl.getInput();
        if (input.desc!==" " && !NaN && input.value>0){
            // add the item to budget controller
            var newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
             // add item to UIController
             UICtrl.addListItem(newItem, input.type);
             // calc the budget and update budget
             updateBudget();
             updatePercentage();
        }
    }

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID=parseInt(splitID[1]);
    
            // delete the item
            budgetCtrl.deleteItem(type, ID);
            // delete from ui
            UICtrl.deleteListItem(itemID);
            // update budget
            updateBudget();
            updatePercentage();
            
        }
    }

    return {
       init: function(){
            setupEventListeners();
            UICtrl.displayMonth();
            UICtrl.displayBudget( {
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            console.log('App has started');
        }
    }
})(budgetControl, UIController);
controller.init();