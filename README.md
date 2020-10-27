# Crit Cola's Minecraft Discord Bot
This bot watches a channel in the Crit Cola Discord server for commands regarding the deployment and destruction of the official Cirt Cola Minecraft server.

## Gitlab
Cirt Cola's Minecraft server is ephemeral and deployed with Terraform via a [Gitlab Pipeline](https://docs.gitlab.com/ee/ci/pipelines/). This bot uses Gitlab's API to parse through the jobs of the past pipelines to determine if the Minecraft server is currently deployed.

## Available Discord commands
```
!mc status
```
Returns a message telling the user if the Minecraft server is currently deployed.


```
!mc deploy
```
Deploys the Minecraft server.

```
!mc destroy
```
Destroys the Minecraft server.

```
!mc info
```
Returns a message informing the user of what modpack and version of Minecraft the server is currently configured to deploy as.
