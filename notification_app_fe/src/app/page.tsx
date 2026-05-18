"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Chip,
  Grid
} from "@mui/material";

import { useEffect, useState } from "react";

import axios from "axios";

interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
  priorityScore: number;
}

export default function Home() {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  useEffect(() => {

    fetchNotifications();

  }, []);

  const fetchNotifications = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/notifications/priority"
      );

      setNotifications(
        response.data.notifications
      );

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <Container maxWidth="md">

      <Box
        sx={{
          mt: 5,
          mb: 5
        }}
      >

        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
        >
          Priority Notifications
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 4 }}
        >
          Top important unread notifications
        </Typography>

        <Grid container spacing={3}>

          {notifications.map((notification) => (

            <Grid
              xs={12}
              key={notification.ID}
            >

              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4
                }}
              >

                <CardContent>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >

                    <Typography
                      variant="h6"
                      fontWeight="bold"
                    >
                      {notification.Message}
                    </Typography>

                    <Chip
                      label={notification.Type}
                      color={
                        notification.Type === "Placement"
                          ? "success"
                          : notification.Type === "Result"
                          ? "primary"
                          : "warning"
                      }
                    />

                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ mt: 2 }}
                  >
                    {notification.Timestamp}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mt: 1 }}
                  >
                    Priority Score:
                    {" "}
                    {notification.priorityScore.toFixed(2)}
                  </Typography>

                </CardContent>

              </Card>

            </Grid>

          ))}

        </Grid>

      </Box>

    </Container>

  );
}