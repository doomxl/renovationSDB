<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AchievementsController extends AbstractController
{
    #[Route('/nos-realisations', name: 'app_achievements')]
    public function index(): Response
    {
        return $this->render('achievements/index.html.twig', [
            'controller_name' => 'AchievementsController',
        ]);
    }
}
