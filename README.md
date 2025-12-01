# template

This project is used to create the standard Github Standard and can be used for any future github project(s)

## Project Default

- "_static": Diagram / Threat model
- "_static/runbooks": Runbooks for the project
- artifacts: any files used for testing or build results
- example: Example uses cases of the gitlab project
- prompts: any prompts used for the project
- src: source code for the project
- tst: any tests related to the project
- .gitignore: any file that should not be included in source control
- codeowners: specific owners of file type, folders, and more
- LICENSE: Copyright information for the project

Optional:
- .npmignore: any file that should not be included in a package file
- .prettierignore: any file that should not be reformatted
- .prettierrc.json: prettier configuration
- .terraform-docs.yaml: terraform documentation
- sonar-project: sonarcloud project configuration

## Prettier Documentation

https://prettier.io/docs/en/configuration.html

## Terraform Documentation

https://terraform-docs.io/user-guide/configuration/

## Gitlab Code Owners

https://docs.gitlab.com/ee/user/project/code_owners.html

## Code Quality

- [SonarQube](https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/)

## Threat Modeling / Diagram

- [Threat Modeling](https://threatdragon.github.io/)
- [diagrams.net](https://www.diagrams.net/doc/#get-started-with-diagramsnet)

## Collaborate with your team

If there are things you dont want, feel free to remove. If you believe this project should be changed, feel free to make an MR.

## How to use this project

1. Clone this repository locally
2. Create a new repository at https://gitlab.com/{group}/security
3. Clone the new repository locally
4. Copy these files from this project to your cloned new repository
5. Commit your changes

## Authors and acknowledgment

@stevencarlson

## Project status

This is only the beginning of the project. This project will be a living example of the gitlab standard.