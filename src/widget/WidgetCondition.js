import React from 'react';

class WidgetCondition extends React.Component 
{
	constructor()
	{
		super();

		this.createCondition = this.createCondition.bind(this);

		this.createExpression = this.createExpression.bind(this);
	}

	/**
	 * 
	 * @param {*} code 
	 * @param {*} type 
	 * @param {*} content 
	 */
    createCondition(code, type, content)
    {
        var expression;

        var expressionPoint = function(attribute, operator, value)
		{
			var expression;
            switch( operator )
			{
				case 'E':
				{
					// equal
					expression = attribute + "='" + value + "'";
					break;
				}
				case 'NE':
				{
					// equal
					expression = attribute + "!='" + value + "'";
					break;
				}
				case 'B':
				{
					// bigger
					expression = attribute + ">'" + value + "'";
					break;
				}
				case 'S':
				{
					// smaller
					expression = attribute + "<'" + value + "'";
					break;
				}
				case 'BE':
				{
					// bigger equal
					expression = attribute + ">='" + value + "'";
					break;
				}
				case 'SE':
				{
					// smaller equal
					expression = attribute + "<='" + value + "'";
					break;
				}
				case 'NL':
				{
					// null
					expression = attribute + " IS NULL";
					break;
				}
				case 'NNL':
				{
					// not null
					expression = attribute + " IS NOT NULL";
					break;
				}
				default:
				{
                    console.error("Unknown point expression operator '"+operator+"'.");
				
				}
			}
			
			return expression;
		};
		
		/**
		 * 构造set表达式
		 */
		var expressionSet = function(attribute, operator, set)
		{
			var expression, first = true;
			
			switch( operator )
			{
				case "IN":
				{
					// in
					expression = attribute + " IN (";
					break;
				}
				case "NIN":
				{
					// not in
					expression = attribute + " NOT IN (";
					break;
				}
				default:
				{
					console.error("Unknown set expression operator '"+operator+"'.");
				}
			}
			
			for( var i in set )
			{
				if( first )
				{
					first = false;
				}
				else
				{
					expression += ",";
				}
				
				expression += "'"+set[i]+"'";
			}
			
			expression += ")";
			
			return expression;
		};

		// 生成 expression表达式
		switch( type )
		{
			case 'point':
			{
				expression = expressionPoint("${"+content.code+"}", content.operator, content.value);
				break;
			}
			case 'range':
			{
				expression = "(" 
					+ expressionPoint("${"+content.min.code+"}", content.min.operator, content.min.value) + ") AND (" 
					+ expressionPoint("${"+content.max.code+"}", content.max.operator, content.max.value) + ")";
				break;
			}
			case 'set':
			{
				expression = expressionSet("${"+content.code+"}", content.operator, content.set);
				break;
			}
			case 'composite':
			{
				var first = true;
				
				expression = "(";
				
				for( var i in content )
				{
					if( first )
					{		
						first = false;
					}
					else
					{
						expression += ") OR (";
					}
					
					expression += expressionSet("${"+content[i].code+"}", content[i].operator, content[i].set);
				}
				
				expression += ")";
				
				break;
            }
            default :
            {
                expression = expressionPoint("${"+content.code+"}", content.operator, content.value);
				break;
            }
        };

        return expression;
	}

	/**
	 * 
	 * @param {*} code 
	 * @param {*} expression 
	 */
	createExpression(code, expression)
	{
		/**
		 * 裁剪条件内容
		 * @param content 剔除两端的"和'
		 */
		var trimValue = function(content)
		{
			if( content.startsWith("'") && content.endsWith("'") )
			{
				return content.substr(1, content.length-2);
			}
			else
			{
				return content;
			}
		};
		
		/**
		 * 读取属性
		 */
		var readAttribute = function(val, base, expression)
		{
			var code = val.trim().substr(2, val.length-3);
			
			if( code.startsWith(base.substr(0, 4))===false )
			{
				console.error( "Code '"+code+"' is not a subdimension of '"+base+"' in condition expression '"+expression+"'.");
				return;
			}
			
			return code;
		};
		
		/**
		 * 读取Point条件内容
		 */
		var readPointContent = function(attribute, val)
		{
			var content;
			
			val = val.trim().split(/\s{2,}/, -1).join(' ').toUpperCase();
			
			if( val.startsWith("=") )
			{
				content = {code:attribute, operator:"E", value:trimValue(val.substr(1).trim())};
			}
			else if( val.startsWith("!=") )
			{
				content = {code:attribute, operator:"NE", value:trimValue(val.substr(2).trim())};
			}
			else if( val.startsWith(">=") )
			{
				content = {code:attribute, operator:"BE", value:trimValue(val.substr(2).trim())};
			}
			else if( val.startsWith("<=") )
			{
				content = {code:attribute, operator:"SE", value:trimValue(val.substr(2).trim())};
			}
			else if( val.startsWith(">") )
			{
				content = {code:attribute, operator:"B", value:trimValue(val.substr(1).trim())};
			}
			else if( val.startsWith("<") )
			{
				content = {code:attribute, operator:"S", value:trimValue(val.substr(1).trim())};
			}
			else if( val==="IS NULL" )
			{
				content = {code:attribute, operator:"NL", value:undefined};
			}
			else if( val==="IS NOT NULL" )
			{
				content = {code:attribute, operator:"NNL", value:undefined};
			}
			else
			{
				console.error("Unknown point data '"+expression+"'.");
				
				return;
			}
			
			return content;
		};
		
		/**
		 * 读取Set条件内容
		 */
		var readSetContent = function(attribute, operator, val)
		{
			var content = {};
			
			content.code = attribute;
			content.operator = operator;
			content.set =  [];
			
			val = val.substr(1, val.length-2).split(",", -1);
			for( var i in val )
			{
				content.set.push(trimValue(val[i].trim()));
			}
			
			return content;
		};
		
		let type, content = {};
		
		// trim
		expression = expression.trim();
		
		// parse expression
		if( expression.indexOf(") AND (")!==-1 )
		{
			// range
			let min, max, expressions;
			
			expressions = expression.substr(1, expression.length-2).trim().split(") AND (", -1);
			if( expressions.length===2 )
			{
				let type = "range";
				
				for( var i in expressions )
				{
					expressions[i] = expressions[i].trim();
					
					var attributes = expressions[i].match(/\$\{\S{1,}\}/, -1);
					if( attributes!=null && attributes.index===0 )
					{
						var value = expressions[i].substr(attributes[0].length).trim();

						// point
						content = readPointContent(readAttribute(attributes[0], code, expression), value);
						
						if( content.operator==='B' || content.operator==='BE' )
						{
							min = content;
						}
						else if( content.operator==='S' || content.operator==='SE' )
						{
							max = content;
						}
						else
						{
							console.error( "Unknown range condition expression '"+expression+"'." );
							return;
						}
					}
					else
					{
						console.error( "Unknown range condition expression '"+expression+"'." );
						return;
					}
				}
				
				if( min===undefined || max===undefined )
				{
					console.error( "Invalid range condition expression '"+expression+"'." );
					return;
				}
				
				content = {min : min, max : max};
			}
			else
			{
				console.error( "Unknown range condition expression '"+expression+"'." );
				return;
			}
		}
		else if( expression.indexOf(") OR (")!==-1 )
		{
			// composite
			let expressions;
			
			type= "composite";
			content = [];
			
			expressions = expression.substr(1, expression.length-2).trim().split(") OR (", -1);
			for( var i in expressions )
			{
				expressions[i] = expressions[i].trim();
				
				var attributes = expressions[i].match(/\$\{\S{1,}\}/, -1);
				if( attributes!==null && attributes.index===0 )
				{

					var value = expressions[i].substr(attributes[0].length).trim().split(/\s{2,}/, -1).join(' ').trim();
					
					if( value.toUpperCase().startsWith("IN") )
					{
						content.push(readSetContent(readAttribute(attributes[0], code, expression), 'IN', value.substr(3).trim()));
					}
					else if( value.toUpperCase().startsWith("NOT IN") )
					{
						content.push(readSetContent(readAttribute(attributes[0], code, expression), 'NIN', value.substr(7).trim()));
					}
					else
					{
						console.error( "Unknown composite condition expression '"+expression+"'." );
						return;
					}
				}
				else
				{
					console.error( "Unknown composite condition expression '"+expression+"'." );
					return;
				}
			}
		}
		else
		{
			if( expression.startsWith("(") && expression.endsWith(")") )
			{
				expression = expression.substr(1, expression.length-2);
			}
			
			var attribute, attributes = expression.match(/\$\{\S{1,}\}/, -1);
			if( attributes!==null && attributes.index===0 )
			{
				var value = expression.substr(attributes[0].length).split(/\s{2,}/, -1).join(' ').trim();
					
				// attribute
				attribute = readAttribute(attributes[0], code, expression);
				
				if( value.toUpperCase().startsWith("IN") )
				{
					// set
					type = "set";
					content = readSetContent(attribute, "IN", value.substr(3).trim());
				}
				else if( value.toUpperCase().startsWith("NOT IN") )
				{
					// set
					type = "set";
					content = readSetContent(attribute, "NIN", value.substr(7).trim());
				}
				else
				{
					// point
					type = "point";
					content = readPointContent(attribute, value);
				}
			}
			else
			{
				console.error( "Unknown condition expression '"+expression+"'." )
			
				return;
			}
		}
		
		return content;
		
	};
}

export default WidgetCondition