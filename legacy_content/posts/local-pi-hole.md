---
title: "Resolving Local DNS in Pi-Hole"
date: 2018-11-28T10:42:25-04:00
draft: false
description: Setup pi-hole to resolve local DNS
tags: [pi-hole, dns]
---

I love Pi-hole, it’s a network based ad blocker that reports all DNS Queries.

But, I’ve been having an issue resolving host names on my local domain through the Pi-hole.

I run an Active Directory/DNS server with all my entries, Pi-hole is the first DNS Provider on my network, and I can resolve the host names on Pi-hole fine. But when I resolve them through the Pi-hole I get no response.

The solution is to add your local domain / DNS to Pi-hole’s DNSMasq.conf

Edit /etc/dnsmasq.d/01-pihole.conf and add:

```
    /server=/arneman.home/10.0.0.2
```
\
Now I can resolve all my host names without issue!
