<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>

<%@page import="org.apache.commons.codec.binary.Base64"%>
<%@page import="org.apache.commons.io.FileUtils"%>
<%@page import="org.apache.commons.lang3.StringUtils"%>

<%@page import="java.io.File"%>

<%
	String sign = StringUtils.split(request.getParameter("sign"), ",")[1];

	String fileName = "sign"+System.currentTimeMillis()+".png";

	FileUtils.writeByteArrayToFile(new File("d:\\"+fileName), Base64.decodeBase64(sign));
%>

{
	"filename" : "<%= fileName %>"
}