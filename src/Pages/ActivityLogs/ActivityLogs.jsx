import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ActivityLogs.css"; // Import the CSS file

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          "https://oceanbackend-c54c9d8a19c1.herokuapp.com/api/user/activity-logs",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Get the token from local storage
            },
          }
        );

        // Add a property to distinguish "admin login" for specific email
        const updatedLogs = response.data.map((log) => ({
          ...log,
          isAdminLogin:
            log.email === "shamindigovipothage2021@gmail.com" &&
            log.activityType === "sign-in",
        }));
        setLogs(updatedLogs);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading)
    return (
      <CircularProgress
        className="loading-spinner"
        style={{ display: "block", margin: "20px auto" }}
      />
    );

  return (
    <TableContainer component={Paper} className="table-container">
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate("/customer-dashboard")}
        className="back-button"
      >
        Back to Dashboard
      </Button>

      <h2 className="table-heading">Activity Logs</h2>
      {logs.length === 0 ? (
        <p className="no-logs-message">No activity logs available.</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Activity Type</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Details</strong>
              </TableCell>
              <TableCell>
                <strong>Timestamp</strong>
              </TableCell>
              <TableCell>
                <strong>Sign In Time</strong>
              </TableCell>
              <TableCell>
                <strong>Sign Out Time</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell className={log.isAdminLogin ? "admin-login" : ""}>
                  {log.isAdminLogin ? "Admin Login" : log.activityType}
                </TableCell>
                <TableCell>{log.email}</TableCell>
                <TableCell>{log.activityDetails}</TableCell>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  {log.activityType === "sign-in"
                    ? new Date(log.timestamp).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {log.activityType === "sign-out"
                    ? new Date(log.timestamp).toLocaleString()
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default ActivityLogs;
