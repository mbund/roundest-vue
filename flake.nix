{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    utils,
    ...
  }:
    utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
        };
      in rec {
        devShells.default = pkgs.mkShell {
          name = "roundest-vue";
          packages = with pkgs; [
            tailwindcss-language-server
            vscode-langservers-extracted
            alejandra
            nodePackages.pnpm
          ];
        };
      }
    );
}
