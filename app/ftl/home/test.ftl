<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<h1>Hello ${word}!</h1>
	<h3>my name is ${name}</h3>
	<ul>		
		<#list lists as item>
		<li>my name is ${item.name}, I am ${item.age} years old.</li>
		</#list>
	</ul>
</body>
</html>