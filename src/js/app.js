App={
	web3Provider: null,
	contracts: {},
	account: '0x0',
	loading: false,
	tokenPrice:1000000000000000,
	tokensSold:0,
	tokensAvailable:750000,

	init: function(){
		console.log("App initialised");
		return App.initWeb3();
	},

	//initiailzng web3
	initWeb3: function(){
		 if( typeof web3 !=='undefined'){
			//if web3 instance is alrdy prvded by metamask
			App.web3Provider= web3.currentProvider;
			web3= new Web3(web3.currentProvider);
			// if (typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
			//   window.ethereum.request({ method: "eth_requestAccounts" });
  	// 			web3 = new Web3(window.ethereum);

		

		}else{
		//	specify default instnce if no instnce is provided
			App.web3Provider= new  Web3.providers.HttpProvider('http://localhost:7545');
				web3= new Web3(App.web3Provider);

			

		}
		
		return App.initContracts();	
	},
	//initialzng smart contracts-
	// build-contrcts- getting contrct reprsntntn from json reprsntatn of our sc's with abi & we will use truffle-contract library to interpret these abi's
	//truffle-contract gives us functionlty to read our contrct and interact with them
	initContracts: function(){
		$.getJSON("UGTokenSale.json", function(ugTokenSale){
			App.contracts.UGTokenSale= TruffleContract(ugTokenSale);// json file
			//creating an abstrctn tht will allow us to intrct with this contrct through truffle contrct
			App.contracts.UGTokenSale.setProvider(App.web3Provider);
			App.contracts.UGTokenSale.deployed().then(function(ugTokenSale){
				console.log("UG Token Sale Address:", ugTokenSale.address);
			});
		}).done(function(){
		$.getJSON("UGToken.json", function(ugToken){
			App.contracts.UGToken= TruffleContract(ugToken );// json file
			//creating an abstrctn tht will allow us to intrct with this contrct through truffle contrct
			App.contracts.UGToken.setProvider(App.web3Provider);
			App.contracts.UGToken.deployed().then(function(ugToken){
				console.log("UG Token Address:", ugToken.address);

			});
			App.litenForEvents(); 
			return App.render();
		});	
			
	})
	},

	//sell event
	//listen for events emitted from contrct
	litenForEvents:function(){
		App.contracts.UGTokenSale.deployed().then(function(instance){
			instance.Sell({},{
				fromBlock:0,
				toBlock:'latest',
			}).watch(function(error,event){
				console.log("event triggered",event);
				App.render();
			})
		})
	},

	//to render on client side
	render: function(){
		if(App.loading){
			return;
		}
		App.loading=true;

		var loader= $('#loader');
		var content= $('#content');

		loader.show();
		content.hide();
 
		//loading account data we r cnnctd to
		web3.eth.getCoinbase(function(err, account){
			if(err===null){
				console.log("account", account);
				App.account=account;
				$('#accountAddress').html("Your account : " + account); 
			}
		})

		//load tokenSale contract
		App.contracts.UGTokenSale.deployed().then(function(instance){
			UGTokenSaleInstance=instance;
			return UGTokenSaleInstance.tokenPrice();
		}).then(function(tokenPrice){
			App.tokenPrice=tokenPrice;
			$('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
			return UGTokenSaleInstance.tokensSold();
		}).then(function(tokensSold){
			// App.tokensSold=375000;
			App.tokensSold=tokensSold.toNumber();
			$('.tokens-sold').html(App.tokensSold);
			$ ('.tokens-available').html(App.tokensAvailable);

			//creating prcntge by dvdng both and then multiply them
			var progressPercent= (App.tokensSold/ App.tokensAvailable) *100;
			$('#progress').css('width',progressPercent + '%');

			//load token contract
			App.contracts.UGToken.deployed().then(function(instance){
			UGTokenInstance=instance;
			return UGTokenInstance.balanceOf(App.account);
		}).then(function(balance){
			$('.ug-balance').html(balance.toNumber());


			App.loading=false;
			loader.hide();
			content.show(); 
		})
	});		
	},

	 buyTokens: function() {
	    $('#content').hide();
	    $('#loader').show();
	    var numberOfTokens = $('#numberOfTokens').val();
	    App.contracts.UGTokenSale.deployed().then(function(instance) {
	      return instance.buyTokens(numberOfTokens, {
	        from: App.account,
	        value: numberOfTokens * App.tokenPrice,
	        gas: 500000 // Gas limit
	      });
	    }).then(function(result) {
	      console.log("Tokens bought...")
	      $('form').trigger('reset') // reset number of tokens in form
	      // Wait for Sell event
	     
	    });
	  }
	}

$(function(){
	$(window).load(function(){
		App.init(); //this fn will execute when window will load
	})
});