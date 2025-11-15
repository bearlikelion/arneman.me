---
title: "Manage Hyper-V Remotely"
date: 2018-01-12T10:46:21-04:00
draft: false
description: Configure Windows to manage a remote Hyper-V host
tags: [hyperv, remote management]
---

While it might be convenient to RDP to your Hyper-V host and use the manager on the server directly. I prefer to run the manage multiple hosts all from my local machine. Below are the steps to take to install the Hyper-V management tools, enable credential delegation, and connect to your host from your local machine.
Install the Hyper-V Management Tools

From Add/Remove Programs, select 'Turn Windows features on or off', then check the Hyper-V Management Tools
![Install Hyper-V Management Tools](/images/hyperv/Install-HV-MGMT.png)

Once installed, you will have the Hyper-V Manager under 'Windows Administrator Tools' in your Start menu

But, when trying to connect to the remote server using our credentials we are prompted to allow delegation, which then fails.
![Enable delegation of user credentials](/images/hyperv/delegation.png)
\
![Delegation could not be enabled](/images/hyperv/CredSSP.png)

## Enabling Remote Management and Credential Delegation

Open PowerShell as Administrator and enable Windows Remote Management on your machine

```
winrm quickconfig
```
\
![WinRM quickconfig](/images/hyperv/WinRM-QC.png)

**Warning:** This will fail if any network adapter is set to 'Public’ to change this please refer to the following [serverfault.com answer](https://serverfault.com/questions/639088/how-do-i-make-a-connection-private-on-windows-server-2012-r2/639090#639090)

Once WinRM is enabled, you will have to configure Windows Credential Security Support Provider (CredSSP) authentication for this machine from the Hyper-V host

```
Enable-WSManCredSSP -Role “Client” -DelegateComputer “hyper-v.FQDN“
```
\
![Enable CredSSP](/images/hyperv/EnableCredSSP.png)

Now that Windows Remote Management and the Credential Security Support Provider are configured we can attempt to login but will receive an unauthorized error.
\
![Delegation unauthoirzed](/images/hyperv/delegation-fail.png)

## Enable NTLM-only Server Authentication from the host

Open **'gpedit.msc'** and navigate to the following tree:\
    **Computer Configuration -> Administrative Templates -> System -> Credential Delegation**

Select 'Allow delegating fresh credentials with NTLM-only server authentication’

![Credential Delegation GP](/images/hyperv/gpedit-msc.png)

Enable the policy and add your Hyper-V host as an allowed server.

```
WSMAN/host.fqdn.tld
```
\
![Enable Delegation](/images/hyperv/enable-delegate.png)

**Also:** You can set WSMAN/*.fqdn.tld to allow all servers to provide credentials, but this may be a security risk

Now use Hyper-V Manager to 'Connect to Server..' and *voilà*!
\
![Hyper-V Remote Manager](/images/hyperv/hyper-v-manager.png)

