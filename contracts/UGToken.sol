pragma solidity ^0.8.19;
//pragma solidity ^0.5.16;


contract UGToken{
		
		string public name="UG Token";
		string public symbol="UG";
		string public standard="UG Token v1.0";
		uint256 public totalSupply;


		event Transfer(
			address indexed _from,
			address indexed _to,
			uint256 _value
		);

		event Approval(
			address indexed _owner,
			address indexed _spender,
			uint256 _value
		);
		
		mapping(address => uint256) public balanceOf;

		 //allowance- returns amt which _spender is still allwd to withdrw from _onwner. eg if accA allws accB to send C tokens, these C tokens get stored here
		//say accA is apprvng any acc say accB or it can be accC etc to spend x amt of tokens,  so  anythng frst address(key) will kepp track of all of accA's approvals

		mapping(address=> mapping( address=> uint256)) public allowance;


	constructor(uint256 _initialSupply) public {

	   		balanceOf[msg.sender]= _initialSupply;     //allocating initial suuply
			       
       		 totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success){
    	//shld shw excption if acc doesnt hve bal
    	//trnsmit event
    	//return boolean

    	require(balanceOf[msg.sender] >= _value);
    	balanceOf[msg.sender] -= _value;
    	balanceOf[_to] += _value;

    	emit Transfer(msg.sender, _to, _value);
    	return true;


    }

    //approve allws _spender to withdrw from ur acc multiple times upto _value amount. it like allwng accB to send tokens on their behalf. like approving exchnge to send x amt of tokens on ur behalf.  it must trigger approval event
    //_sepnder= acc that we want to send trnsctn on our behalf

    function approve(address _spender, uint256 _value) public returns (bool success){

    	allowance[msg.sender][_spender]=_value; // refrncg the abve allwnce mapping
    	emit Approval(msg.sender, _spender, _value);
    	return true;

    }

    //transferFrom handles approve fn. it transfers _value amt of tokens from address _from(acc who we r spending on behalf of) to address _to, & must fire transfer event

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
    	require(_value <= balanceOf[_from]);
    	require(_value <= allowance[_from][msg.sender]);	

    	balanceOf[_from] -= _value;
    	balanceOf[_to] += _value;	
    	allowance[_from][msg.sender] -= _value;

    	emit Transfer(_from, _to, _value);

    	return true;


    }

}