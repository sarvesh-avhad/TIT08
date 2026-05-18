"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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

export default function PriorityPage() {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [filter, setFilter] =
    useState("All");

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

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
          n => n.Type === filter
        );

  return (

    <Container maxWidth="lg">

      <Box sx={{ mt: 5, mb: 5 }}>

        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "white" }}
        >
          Priority Inbox
        </Typography>

        <Box sx={{ mb: 4, width: 220 }}>

          <FormControl
            fullWidth
            sx={{
              backgroundColor: "white",
              borderRadius: 2
            }}
          >

            <InputLabel>
              Filter
            </InputLabel>

            <Select
              value={filter}
              label="Filter"
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
            >

              <MenuItem value="All">
                All
              </MenuItem>

              <MenuItem value="Placement">
                Placement
              </MenuItem>

              <MenuItem value="Result">
                Result
              </MenuItem>

              <MenuItem value="Event">
                Event
              </MenuItem>

            </Select>

          </FormControl>

        </Box>

        <Grid container spacing={3}>

          {filteredNotifications.map(
            (notification) => (

            <Grid
              xs={12}
              md={6}
              lg={4}
              key={notification.ID}
            >

              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 5,
                  height: "100%"
                }}
              >

                <CardContent>

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
                    sx={{ mt: 2 }}
                  />

                  <Typography sx={{ mt: 2 }}>
                    {notification.Timestamp}
                  </Typography>

                  <Typography sx={{ mt: 1 }}>
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