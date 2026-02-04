{ pkgs ? import <nixpkgs> { } }:
let
  PROJECT_ROOT = toString ./.;
in
pkgs.mkShell {
  nativeBuildInputs = with pkgs.buildPackages; [
    nodejs_25
    mysql80
    nodemon
  ];
  shellHook = ''
    export MYSQL_ROOT_PASSWORD=hapi
    export MYSQL_DATABASE=user

    if [ ! -d "${PROJECT_ROOT}/.mysql" ]; then
      mkdir -p "${PROJECT_ROOT}/.mysql/data"
      mysqld --initialize-insecure --datadir="${PROJECT_ROOT}/.mysql/data"
      echo "
        [mysqld]
        datadir = ${PROJECT_ROOT}/.mysql/data
        socket = ${PROJECT_ROOT}/.mysql/mysql.sock
        port = 3307
        skip-networking = false
        bind-address = 127.0.0.1
      " > "${PROJECT_ROOT}/.mysql/my.cnf"

      # mysqld --defaults-file=".mysql/my.cnf" --default-authentication-plugin=mysql_native_password
    fi
  '';
}
