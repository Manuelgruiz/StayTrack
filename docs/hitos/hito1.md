# Hito 1 – Repository Setup and Project Definition

Student: Manuel García Ruiz  
Email: manuelgruiz22@gmail.com  
Project: StayTrack

---

## Overview Milestone 1
This milestone sets up the development environment and defines the project that will be deployed to the cloud during the course.

## Git Environment Setup
1. **Verify Git is installed**  
   `git --version`

2. **Generate SSH key pair and add it to GitHub**  
   `ssh-keygen -t ed25519 -C "manuelgruiz22@gmail.com"`  
   Then add the public key from the `*.pub` file to GitHub (Settings → SSH and GPG keys).

3. **Configure Git identity**  
   `git config --global user.name "Manuel García Ruiz"`  
   `git config --global user.email "manuelgruiz22@gmail.com"`

4. **Update GitHub profile**  
   - Updated name, location and university.  
   - Enabled **Two-Factor Authentication (2FA)**.  
   - Screenshots stored in `docs/screenshots/`.

## Repository Structure
StayTrack/
├── .gitignore
├── LICENSE
├── README.md
└── docs/
├── hito01.md
└── screenshots/


## Screenshots
- [Updated GitHub profile](../screenshots/Screenshot_profile.png)
- [Enabled 2FA](../screenshots/Screenshot_2FA.png)
- [Public SSH key](../screenshots/Screenshot_ssh.png)
