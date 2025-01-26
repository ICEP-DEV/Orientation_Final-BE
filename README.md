
# 2022_Orientation_BE
### -Express Server running and mysql mariadb active tested with xampp servies providing instance of mysql server (25/02/2022)
### -Student Registration Completed (27/02/2022)
### -Student Login Completed (28/02/2022)
### -Admin Login and Registration (01/03/2022)
### -SMTP Sender completed for registration (01/03/2022)
### -IO Socket connection and disconnected event listeres completed (14/03/2022)
### -Context Restructuring of the API completed (14/03/2022)
### -Listers of socket io done (16/03/2022)
### -Image upload with multer (17/03/2022)
### -Video upload with multer (18/03/2022)
### -Socket io division to a new folder (18/03/2022)
### -Delete binaries with fs (23/03/2022)
### -Admin Edition Blog and Delete blog (25/03/2022)
### -Admin Delete Video and Editing (28/03/2022)
### -PDF Render for generate survey (01/04/2022)
### -PDF Certificate generated (03/04/2022)
### -SMTP To aws Hosted (04/04/2022)
### -Get content of Orientation (06/04/2022)
### -Saving Users progress (10/04/2022)
### -Retriving Users progress (16/04/2022)
### -Socket IO for Videos (17/04/2022)
# 100% Done


setEnvIf X-Forwarded-proto https HTTPS=on
<VirtualHost _default_:80>
    DocumentRoot "/opt/bitnami/apache/htdocs"
    <Directory "/opt/bitnami/apache/htdocs">
      Optionas Indexes FollowSymLinks
      AllowOverride All
      Require all granted
    </Directory>
    #Error Documents
    ErrorDocument 503 /503.html
  </VirtualHost>
 Include "/opt/bitnami/conf/bitnami/bitnami-ssl.conf"
  Include "/opt/bitnami/conf/httpd-prefix.conf"

  //       105.245.116.231/32

