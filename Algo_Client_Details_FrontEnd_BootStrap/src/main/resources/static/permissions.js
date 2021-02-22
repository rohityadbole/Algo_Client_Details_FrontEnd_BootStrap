/*$(document).ready(function(){
	getPermissionsList();
});*/
$(document).ready(function(){
	getPermissionsList();
	
	$("#updateOperation").click(function() {
		doUpdate();
	});
	

	$("#deleteOperation").click(function() {
		doDelete();
	});
	

	$("#addOperation").click(function() {
		doAdd();
	});
	
	
	
});

function getPermissionsList() {
	$.ajax({ 
		  type: "GET",
		  url: "http://localhost:8096/permissions",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  if(msg.length>0) {
			    $.each(msg, function (index, value) {
			        //$("tbody").append(" <tr><td>"+(index+1)+"</td><td>"+value.permission_name+"</td></tr>");
			        
			        $("tbody").append(" <tr><td>"+(index+1)+"</td><td>"+value.permission_name+"</td>" +
			        		" <td class=\"text_align_center\"><button class=\"customBtn\" title=\"Edit\" onclick=\"editOperationModel("+value.id+",'"+value.permission_name+"')\"><i class=\"fa fa-edit\"></i></button>&nbsp;&nbsp;&nbsp;&nbsp;" +
			        		"<button class=\"closeBtn\" title=\"Delete\" onclick=\"deleteOperationModel("+value.id+")\"><i class=\"fa fa-remove\"></i></button></td></tr>");
			    });
			  } else {
				  $("tbody").append(" <tr><td  colspan=\"2\">No records to display</td></tr>");
			  }
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewToken("permissions.html");
			  } else if(XMLHttpRequest.status==403) {
				  $("table").remove(); $(".alert-danger").show();
			   } else { localStorage.clear(); window.location.href="index.html"; }
		  }
		});
}

function editOperationModel(id, permission_name) {
	$("#edit_permission_name").val(permission_name);
	$("#edit_id").val(id);
	$("#editModal").modal('show');
	
}

function doAdd() {
	
	
	$.ajax({
		  type: "POST",
		  url: "http://localhost:8096/permissions",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			    request.setRequestHeader("Content-Type", "application/json");
			  },
			  data: JSON.stringify({ 
					"permission_name": $("#permission_name").val().trim() 
				 }),
		  success: function(msg){
			  $("#myModal").modal('hide');
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>Permission added successfully</strong>');
			  getPermissionsList();
			  $("#permission_name").val('');
			  
			  
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  doAdd();
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $("#myModal").modal('hide');
				  $(".alert-danger").html('<strong>You don\'t have the permission to do add a new Permission</strong>');
				  $(".alert-danger").show();
				  $(".alert-success").hide();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
}

function doDelete() {
	
	$.ajax({
		  type: "DELETE",
		  url: "http://localhost:8096/permissions/"+$("#delete_id").val(),
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			  },
		  success: function(msg){
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>Permission deleted successfully</strong>');
			  $("#deleteModel").modal('hide');
			  getPermissionsList();
			  
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  doDelete();
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $("#deleteModel").modal('hide');
				  $(".alert-danger").html('<strong>You don\'t have the permission to do delete operation</strong>');
				  $(".alert-danger").show();
					$(".alert-success").hide();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
}

function doUpdate() {
	$.ajax({
		  type: "PUT",
		  url: "http://localhost:8096/permissions/"+$("#edit_id").val(),
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Bearer "+localStorage.getItem("access_token"));
			    request.setRequestHeader("Content-Type", "application/json");
			  },
			  data: JSON.stringify({ 
					"permission_name": $("#edit_permission_name").val().trim()
				 }),
		  success: function(msg){
			  $("#editModal").modal('hide');
			  $(".alert-success").show();
			  $(".alert-danger").hide();
			  $(".alert-success").html('<strong>Permission updated successfully</strong>');
			  getPermissionsList();
			  
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  if(XMLHttpRequest.responseText.indexOf("Access token expired:")!=-1) {
				  getNewTokenOnOperation(function() {
					  doUpdate();
				  });
			  } else if(XMLHttpRequest.status==403) {
				  $("#editModal").modal('hide');
				  $(".alert-danger").html('<strong>You don\'t have the permission to do edit/update operation</strong>');
				  $(".alert-danger").show();
				  $(".alert-success").hide();
			   } else {
				 localStorage.clear();
				 window.location.href="index.html";
			   }
		  }
		});
	
}


function deleteOperationModel(id) {
	$("#delete_id").val(id);
	$("#deleteModel").modal('show');	
}

function getNewToken(pageName) {
	$.ajax({
		  type: "POST",
		  url: "http://localhost:8097/oauth/token",
		  data: "refresh_token="+localStorage.getItem("refresh_token")+"&grant_type=refresh_token",
		  beforeSend: function(request) {
			    request.setRequestHeader("Authorization", "Basic "+btoa("talk2amareswaran:talk2amareswaran@123"));
			    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			  },
		  success: function(msg){
		        localStorage.setItem("access_token", JSON.parse(JSON.stringify(msg)).access_token);
		        localStorage.setItem("refresh_token", JSON.parse(JSON.stringify(msg)).refresh_token);
		        window.location.reload(pageName);
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown) {
			  localStorage.clear();
			  window.location.href="index.html";
		  }
		});
}