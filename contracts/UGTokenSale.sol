pragma solidity ^0.8.19;
//pragma solidity ^0.5.16;

import "./UGToken.sol";

contract UGTokenSale{
	address payable admin; //admin is the one who deployed the contrct, not set public bcz we dnt want to expose its address
	UGToken public tokenContract; // contract datatype  . it will give us a fn tht wl guve its address
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(address _buyer, uint256 _amount);

	//assign admin, 2) assig token contrct 3) assign token price(wei)
	constructor(UGToken _tokenContract, uint256 _tokenPrice) public{
		admin=payable(msg.sender);
		tokenContract =_tokenContract;
		tokenPrice=_tokenPrice;

	}

	function multiply(uint x, uint y) internal pure returns(uint z){
		require( y==0 || (z = x * y) / y ==x );
	}

//buy tokens and provision some tokens to this contract from totalSupply(UGToken contrct)
//1keep track of sold tokens 2) trigger sell evnt 3)require- value=tokenPrice 4) require- contrct has enough tokens 5) require- sccessful transfer

	function buyTokens(uint256 _numberOfTokens) public payable{

		require(msg.value == multiply(_numberOfTokens , tokenPrice));

	  //this-> refers to current contrct
		require(tokenContract.balanceOf(address(this)) >= _numberOfTokens); 

		require(tokenContract.transfer(msg.sender, _numberOfTokens));

		tokensSold += _numberOfTokens;
		emit Sell(msg.sender, _numberOfTokens );

	}

//self destruct- destroys the current contrct, sending its funds to given address function
//1)requires admin to call it 2)trasnfer remaining ugtokens to admin 3) destroy contract

	function endSale() public{
		require(msg.sender == admin);
		require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

		//	selfdestruct(msg.sender);
		 // or Just transfer the balance to the admin
       (admin).transfer(address(this).balance);

	}

} 